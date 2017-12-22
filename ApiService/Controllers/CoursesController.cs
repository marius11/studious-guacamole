using ApiService.Models;
using DataAccess;
using System;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace Service.Controllers
{
    [RoutePrefix("api/courses")]
    public class CoursesController : ApiController
    {
        [HttpGet]
        [Route("")]
        public async Task<HttpResponseMessage> GetAllCourses()
        {
            HttpResponseMessage httpResponse;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var courses = await
                        (from c in db.Courses
                         select new CourseDTO
                         {
                             Id = c.Id,
                             Name = c.Name
                         }).ToListAsync();

                    httpResponse = Request.CreateResponse(HttpStatusCode.OK, courses);
                }
            }
            catch (Exception e)
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            Thread.Sleep(3000);
            return httpResponse;
        }

        [HttpGet]
        [Route("")]
        public async Task<HttpResponseMessage> GetCoursesPaged([FromUri] int? page, [FromUri] int? per_page)
        {
            int pageNumber = page - 1 ?? 0;
            int pageSize = per_page ?? 5;

            HttpResponseMessage httpResponse;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var courses = await
                        (from c in db.Courses
                         select new CourseDTO
                         {
                             Id = c.Id,
                             Name = c.Name
                         }).OrderBy(i => i.Id).Skip(pageNumber * pageSize).Take(pageSize).ToListAsync();

                    var pagedResponse = new PagingModel<CourseDTO>
                    {
                        Data = courses,
                        Count = await db.Courses.CountAsync()
                    };

                    httpResponse = Request.CreateResponse(HttpStatusCode.OK, pagedResponse);
                }
            }
            catch (Exception e)
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadGateway, e);
            }
            Thread.Sleep(3000);
            return httpResponse;
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<HttpResponseMessage> GetCourseById(int id)
        {
            HttpResponseMessage httpResponse;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var course = await
                        (from c in db.Courses
                         where c.Id == id
                         select new CourseDTO
                         {
                             Id = c.Id,
                             Name = c.Name
                         }).SingleAsync();

                    httpResponse = course != null ?
                        Request.CreateResponse(HttpStatusCode.OK, course) :
                        Request.CreateErrorResponse(HttpStatusCode.NotFound, $"The course with ID {id} has not been found");
                }
            }
            catch (Exception e)
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            Thread.Sleep(3000);
            return httpResponse;
        }

        [HttpGet]
        [Route("{id:int}/students")]
        public async Task<HttpResponseMessage> GetStudentsByCourses(int id)
        {
            HttpResponseMessage httpResponse;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var students = await db.Courses.Where(c => c.Id == id).SelectMany(x => x.Students).Select(s => new StudentDTO
                    {
                        Id = s.Id,
                        FirstName = s.FirstName,
                        LastName = s.LastName
                    }).ToListAsync();

                    httpResponse = students != null ?
                        Request.CreateResponse(HttpStatusCode.OK, students) :
                        Request.CreateErrorResponse(HttpStatusCode.NotFound, $"The course with ID {id} doesn't have students assigned");
                }
            }
            catch (Exception e)
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            Thread.Sleep(3000);
            return httpResponse;
        }

        [HttpPost]
        [Route("")]
        public async Task<HttpResponseMessage> AddCourse([FromBody] CourseDTO courseDTO)
        {
            HttpResponseMessage httpResponse;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var course = new Course
                    {
                        Name = courseDTO.Name
                    };

                    db.Courses.Add(course);
                    await db.SaveChangesAsync();

                    httpResponse = Request.CreateResponse(HttpStatusCode.Created, course);
                }
            }
            catch (Exception e)
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            Thread.Sleep(3000);
            return httpResponse;
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<HttpResponseMessage> UpdateCourse(int id, CourseDTO courseDTO)
        {
            HttpResponseMessage httpResponse;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var course = new Course() { Id = courseDTO.Id, Name = courseDTO.Name };

                    db.Courses.Attach(course);
                    db.Entry(course).Property(p => p.Name).IsModified = true;
                    await db.SaveChangesAsync();

                    httpResponse = Request.CreateResponse(HttpStatusCode.OK, course);
                }
            }
            catch (Exception e)
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            Thread.Sleep(3000);
            return httpResponse;
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<HttpResponseMessage> DeleteCourse(int id)
        {
            HttpResponseMessage httpResponse;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var course = await db.Courses.SingleAsync(c => c.Id == id);

                    if (course != null)
                    {
                        db.Courses.Remove(course);
                        await db.SaveChangesAsync();

                        var message = new { message = "The course has been successfully deleted" };
                        httpResponse = Request.CreateResponse(HttpStatusCode.OK, message);
                    }
                    else
                    {
                        httpResponse = Request.CreateErrorResponse(HttpStatusCode.NotFound, $"The course with ID {id} has not been found");
                    }
                }
            }
            catch (Exception e)
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            Thread.Sleep(3000);
            return httpResponse;
        }
    }
}
