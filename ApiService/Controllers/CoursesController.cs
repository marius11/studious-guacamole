using ApiService.Models;
using DataAccess;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
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
                         select new CourseDetailDTO
                         {
                             Id = c.Id,
                             Name = c.Name,
                             Students = (from s in c.Students select new StudentDTO
                             {
                                 Id = s.Id,
                                 FirstName = s.FirstName,
                                 LastName = s.LastName
                             }).ToList()
                         }).ToListAsync();

                    httpResponse = Request.CreateResponse(HttpStatusCode.OK, courses);
                }
            }
            catch
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    "An error occurred while retrieving courses.");
            }
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
                         select new CourseDetailDTO
                         {
                             Id = c.Id,
                             Name = c.Name,
                             Students = (from s in c.Students select new StudentDTO
                             {
                                 Id = s.Id,
                                 FirstName = s.FirstName,
                                 LastName = s.LastName
                             }).ToList()
                         }).FirstOrDefaultAsync();

                    httpResponse = course != null ?
                        Request.CreateResponse(HttpStatusCode.OK, course) :
                        Request.CreateErrorResponse(HttpStatusCode.NotFound,
                            $"The course with ID {id} has not been found.");
                }
            }
            catch
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    $"An error occurred while trying to retrieve the course with ID {id}.");
            }
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

                    httpResponse = students.Any() ?
                        Request.CreateResponse(HttpStatusCode.OK, students) :
                        Request.CreateErrorResponse(HttpStatusCode.NotFound,
                            $"The course with ID {id} doesn't have students assigned.");
                }
            }
            catch
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    $"An error occurred while retrieving the students of course with id {id}.");
            }
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
            catch
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    $"An error occurred while adding the course with the name {courseDTO.Name}.");
            }
            return httpResponse;
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<HttpResponseMessage> UpdateCourse(int id, CourseDTO course)
        {
            HttpResponseMessage httpResponse;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var result = await db.Courses.FirstOrDefaultAsync(i => i.Id == id);

                    if (result != null)
                    {
                        result.Name = course.Name;
                        await db.SaveChangesAsync();

                        httpResponse = Request.CreateResponse(HttpStatusCode.OK, result);
                    }
                    else
                    {
                        httpResponse = Request.CreateErrorResponse(HttpStatusCode.NotFound,
                            $"The course with ID {id} has not been found.");
                    }
                }
            }
            catch
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    $"An error occurred while trying to update the course with ID {id}.");
            }
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
                    var course = await db.Courses.FirstOrDefaultAsync(c => c.Id == id);

                    if (course != null)
                    {
                        db.Courses.Remove(course);
                        await db.SaveChangesAsync();

                        httpResponse = Request.CreateResponse(HttpStatusCode.OK);
                    }
                    else
                    {
                        httpResponse = Request.CreateErrorResponse(HttpStatusCode.NotFound,
                            $"The course with ID {id} has not been found.");
                    }
                }
            }
            catch
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    $"An error occurred while trying to delete the course with ID {id}.");
            }
            return httpResponse;
        }
    }
}
