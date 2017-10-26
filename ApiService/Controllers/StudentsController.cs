using ApiService.Models;
using DataAccess;
using System;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Service.Controllers
{
    [RoutePrefix("api/students")]
    public class StudentsController : ApiController
    {
        [HttpGet]
        [Route("")]
        public async Task<HttpResponseMessage> GetAllStudents()
        {
            HttpResponseMessage studentHttpResponseMessage;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var students = await
                        (from s in db.Students
                         select new StudentDTO
                         {
                             Id = s.Id,
                             Name = s.Name
                         }).ToListAsync();
                    studentHttpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, students);
                }
            }
            catch (Exception e)
            {
                studentHttpResponseMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            return studentHttpResponseMessage;
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<HttpResponseMessage> GetStudentById(int id)
        {
            HttpResponseMessage studentHttpResponseMessage;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var student = await
                        (from s in db.Students
                         where s.Id == id
                         select new StudentDetailDTO
                         {
                             Id = s.Id,
                             Name = s.Name,
                             Courses = (from c in s.Courses
                                        select new CourseDTO
                                        {
                                            Id = c.Id,
                                            Name = c.Name
                                        }).ToList()
                         }).FirstOrDefaultAsync();

                    studentHttpResponseMessage = student != null ?
                        Request.CreateResponse(HttpStatusCode.OK, student) :
                        Request.CreateErrorResponse(HttpStatusCode.NotFound,
                            $"The student with ID {id} has not been found.");
                }
            }
            catch
            {
                studentHttpResponseMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    $"An error occurred while trying to retrieve the student with ID {id}.");
            }
            return studentHttpResponseMessage;
        }

        [HttpGet]
        [Route("{id:int}/courses")]
        public async Task<HttpResponseMessage> GetCoursesByStudent(int id)
        {
            HttpResponseMessage studentHttpResponseMessage;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var courses = await (from s in db.Students
                                         from c in s.Courses
                                         where s.Id == id
                                         select new CourseDTO
                                         {
                                             Id = c.Id,
                                             Name = c.Name
                                         }).ToListAsync();

                    studentHttpResponseMessage = courses != null ?
                        Request.CreateResponse(HttpStatusCode.OK, courses) :
                        Request.CreateErrorResponse(HttpStatusCode.NotFound, $"The student with ID {id} doesn't have courses.");
                }
            }
            catch
            {
                studentHttpResponseMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    $"An error occurred while retrieving the courses of student with ID {id}.");
            }
            return studentHttpResponseMessage;
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<HttpResponseMessage> UpdateStudent(int id, StudentDTO student)
        {
            HttpResponseMessage studentHttpResponseMessage;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var result = await db.Students.FirstOrDefaultAsync(i => i.Id == id);

                    if (result != null)
                    {
                        result.Name = student.Name;
                        await db.SaveChangesAsync();

                        studentHttpResponseMessage = Request.CreateResponse(HttpStatusCode.OK, result);
                    }
                    else
                    {
                        studentHttpResponseMessage = Request.CreateErrorResponse(HttpStatusCode.NotFound,
                            $"The student with ID {id} has not been found.");
                    }
                }
            }
            catch
            {
                studentHttpResponseMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    $"An error occurred while trying to update the student with ID {id}.");
            }
            return studentHttpResponseMessage;
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<HttpResponseMessage> DeleteStudent(int id)
        {
            HttpResponseMessage studentHttpResponseMessage;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var student = await db.Students.FirstOrDefaultAsync(s => s.Id == id);

                    if (student != null)
                    {
                        db.Students.Remove(student);
                        await db.SaveChangesAsync();

                        studentHttpResponseMessage = Request.CreateResponse(HttpStatusCode.OK);
                    }
                    else
                    {
                        studentHttpResponseMessage = Request.CreateErrorResponse(HttpStatusCode.NotFound,
                            $"The student with ID {id} has not been found.");
                    }
                }
            }
            catch
            {
                studentHttpResponseMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest,
                    $"An error occurred while trying to remove the student with ID {id}.");
            }
            return studentHttpResponseMessage;
        }
    }
}
