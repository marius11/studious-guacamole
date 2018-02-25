using System;
using System.Data;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

using DataAccess;
using ApiService.Models;

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
                    var courses = await db.Database.SqlQuery<CourseDTO>("GetAllCourses").ToListAsync();
                    httpResponse = Request.CreateResponse(HttpStatusCode.OK, courses);
                }
            }
            catch (Exception e)
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            return httpResponse;
        }

        [HttpGet]
        [Route("")]
        public async Task<HttpResponseMessage> GetCoursesPaged([FromUri] int? page, [FromUri] int? per_page)
        {
            HttpResponseMessage httpResponse;

            int pageNumber = page - 1 ?? 0;
            int pageSize = per_page ?? 10;

            var pagedCoursesParams = new[]
            {
                new SqlParameter("@page_number", SqlDbType.Int) { Value = pageNumber },
                new SqlParameter("@page_size", SqlDbType.Int) { Value = pageSize }
            };

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var courses = await db.Database
                        .SqlQuery<CourseDTO>("GetCoursesPaged @page_number, @page_size", pagedCoursesParams)
                        .ToListAsync();

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
            return httpResponse;
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<HttpResponseMessage> GetCourseById(int id)
        {
            HttpResponseMessage httpResponse;
            var courseIdParam = new SqlParameter("@Id", SqlDbType.Int) { Value = id };

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var course = await db.Database
                        .SqlQuery<CourseDTO>("GetCourseById @Id", courseIdParam)
                        .SingleAsync();

                    httpResponse = course != null ?
                        Request.CreateResponse(HttpStatusCode.OK, course) :
                        Request.CreateErrorResponse(HttpStatusCode.NotFound, $"The course with ID {id} has not been found");
                }
            }
            catch (Exception e)
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            return httpResponse;
        }

        [HttpGet]
        [Route("{id:int}/students")]
        public async Task<HttpResponseMessage> GetStudentsByCourseId(int id)
        {
            HttpResponseMessage httpResponse;
            var courseIdParam = new SqlParameter("@Id", SqlDbType.Int) { Value = id };

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var students = await db.Database
                        .SqlQuery<CourseDTO>("GetStudentsByCourseId @Id", courseIdParam)
                        .ToListAsync();

                    httpResponse = students != null ?
                        Request.CreateResponse(HttpStatusCode.OK, students) :
                        Request.CreateErrorResponse(HttpStatusCode.NotFound, $"The course with ID {id} doesn't have students assigned");
                }
            }
            catch (Exception e)
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            return httpResponse;
        }

        [HttpGet]
        [Route("")]
        public async Task<HttpResponseMessage> GetCoursesFiltered([FromUri] string search_term, [FromUri] int? per_page)
        {
            HttpResponseMessage httpResponse;
            int pageSize = per_page ?? 10;

            var filteredCoursesParams = new[]
            {
                new SqlParameter("@search_query", SqlDbType.NVarChar, search_term.Length) { Value = search_term },
                new SqlParameter("@per_page", SqlDbType.Int) { Value = pageSize }
            };

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var courses = await db.Database
                        .SqlQuery<CourseDTO>("GetCoursesFiltered @search_query, @per_page", filteredCoursesParams)
                        .ToListAsync();

                    var pagedResponse = new PagingModel<CourseDTO>
                    {
                        Data = courses,
                        Count = courses.Count
                    };
                    
                    httpResponse = Request.CreateResponse(HttpStatusCode.OK, pagedResponse);
                }
            }
            catch (Exception e)
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            return httpResponse;
        }

        [HttpPost]
        [Route("")]
        public async Task<HttpResponseMessage> AddCourse([FromBody] CourseDTO courseDTO)
        {
            HttpResponseMessage httpResponse;
            var insertCourseParam = new SqlParameter("@Name", SqlDbType.NVarChar, courseDTO.Name.Length)
            {
                Value = courseDTO.Name
            };

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var course = await db.Database
                        .SqlQuery<CourseDTO>("InsertCourse @Name", insertCourseParam)
                        .SingleAsync();

                    httpResponse = Request.CreateResponse(HttpStatusCode.Created, course);
                }
            }
            catch (Exception e)
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
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
            return httpResponse;
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<HttpResponseMessage> DeleteCourse(int id)
        {
            HttpResponseMessage httpResponse;
            var deleteCourseParam = new SqlParameter("@Id", SqlDbType.Int) { Value = id };

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    await db.Database.ExecuteSqlCommandAsync("DeleteCourseById @Id", deleteCourseParam);
                    httpResponse = Request.CreateResponse(HttpStatusCode.OK);
                }
            }
            catch (Exception e)
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            return httpResponse;
        }
    }
}
