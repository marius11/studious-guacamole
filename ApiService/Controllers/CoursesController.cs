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
            HttpResponseMessage courseHttpResponseMessage;

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

                    courseHttpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, courses);
                }
            }
            catch
            {
                courseHttpResponseMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    "An error occurred while retrieving courses.");
            }
            return courseHttpResponseMessage;
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<HttpResponseMessage> GetCourseById(int id)
        {
            HttpResponseMessage courseHttpResponseMessage;

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
                         }).FirstOrDefaultAsync();

                    courseHttpResponseMessage = course != null ?
                        Request.CreateResponse(HttpStatusCode.OK, course) :
                        Request.CreateErrorResponse(HttpStatusCode.NotFound,
                            $"The course with ID {id} has not been found.");
                }
            }
            catch
            {
                courseHttpResponseMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    $"An error occurred while trying to retrieve the course with ID {id}.");
            }
            return courseHttpResponseMessage;
        }

        [HttpGet]
        [Route("{id:int}/students")]
        public async Task<HttpResponseMessage> GetStudentsByCourses(int id)
        {
            HttpResponseMessage courseHttpRequestMessage;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var students = await db.Courses.Where(c => c.Id == id).SelectMany(x => x.Students).Select(s => new
                    {
                        StudentId = s.Id,
                        Name = s.Name
                    }).ToListAsync();

                    courseHttpRequestMessage = students != null ?
                        Request.CreateResponse(HttpStatusCode.OK, students) :
                        Request.CreateErrorResponse(HttpStatusCode.NotFound,
                            $"The course with ID {id} doesn't have students assigned.");
                }
            }
            catch
            {
                courseHttpRequestMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    $"An error occurred while retrieving the students of course with id {id}.");
            }
            return courseHttpRequestMessage;
        }

        [HttpPost]
        [Route("")]
        public async Task<HttpResponseMessage> AddCourse(CourseDTO course)
        {
            HttpResponseMessage courseHttpResponseMessage;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    Course newCourse = new Course
                    {
                        Name = course.Name
                    };

                    db.Courses.Add(newCourse);
                    await db.SaveChangesAsync();

                    courseHttpResponseMessage = Request.CreateResponse(HttpStatusCode.Created, course);
                }
            }
            catch
            {
                courseHttpResponseMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    $"An error occurred while adding the course with the name {course.Name}.");
            }

            return courseHttpResponseMessage;
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<HttpResponseMessage> UpdateCourse(int id, CourseDTO course)
        {
            HttpResponseMessage courseHttpResponseMessage;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var result = await db.Courses.FirstOrDefaultAsync(i => i.Id == id);

                    if (result != null)
                    {
                        result.Name = course.Name;
                        await db.SaveChangesAsync();

                        courseHttpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, result);
                    }
                    else
                    {
                        courseHttpResponseMessage = Request.CreateErrorResponse(HttpStatusCode.NotFound,
                            $"The course with ID {id} has not been found.");
                    }
                }
            }
            catch
            {
                courseHttpResponseMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    $"An error occurred while trying to update the course with ID {id}.");
            }
            return courseHttpResponseMessage;
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<HttpResponseMessage> DeleteCourse(int id)
        {
            HttpResponseMessage courseHttpResponseMessage;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var course = await db.Courses.FirstOrDefaultAsync(c => c.Id == id);

                    if (course != null)
                    {
                        db.Courses.Remove(course);
                        await db.SaveChangesAsync();

                        courseHttpResponseMessage = Request.CreateResponse(HttpStatusCode.OK);
                    }
                    else
                    {
                        courseHttpResponseMessage = Request.CreateErrorResponse(HttpStatusCode.NotFound,
                            $"The course with ID {id} has not been found.");
                    }
                }
            }
            catch
            {
                courseHttpResponseMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    $"An error occurred while trying to delete the course with ID {id}.");
            }
            return courseHttpResponseMessage;
        }
    }
}
