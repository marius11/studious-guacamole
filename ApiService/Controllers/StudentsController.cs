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
            HttpResponseMessage httpResponse;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var students = await
                        (from s in db.Students
                         select new StudentDTO
                         {
                             Id = s.Id,
                             FirstName = s.FirstName,
                             LastName = s.LastName
                         }).ToListAsync();

                    httpResponse = Request.CreateResponse(HttpStatusCode.OK, students);
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
        public async Task<HttpResponseMessage> GetStudentsPaged([FromUri] int? page, [FromUri] int? per_page)
        {
            int pageNumber = page - 1 ?? 0;
            int pageSize = per_page ?? 10;

            HttpResponseMessage httpResponse;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var students = await
                        (from s in db.Students
                         select new StudentDTO
                         {
                             Id = s.Id,
                             FirstName = s.FirstName,
                             LastName = s.LastName
                         }).OrderBy(i => i.Id).Skip(pageNumber * pageSize).Take(pageSize).ToListAsync();

                    var pagedResponse = new PagingModel<StudentDTO>
                    {
                        Data = students,
                        Count = await db.Students.CountAsync()
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

        [HttpGet]
        [Route("{id:int}")]
        public async Task<HttpResponseMessage> GetStudentById(int id)
        {
            HttpResponseMessage httpResponse;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var student = await
                        (from s in db.Students
                         where s.Id == id
                         select new StudentDTO
                         {
                             Id = s.Id,
                             FirstName = s.FirstName,
                             LastName = s.LastName
                         }).SingleAsync();

                    httpResponse = student != null ?
                        Request.CreateResponse(HttpStatusCode.OK, student) :
                        Request.CreateErrorResponse(HttpStatusCode.NotFound, $"The student with ID {id} has not been found");
                }
            }
            catch (Exception e)
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            return httpResponse;
        }

        [HttpGet]
        [Route("{id:int}/courses")]
        public async Task<HttpResponseMessage> GetCoursesByStudentId(int id)
        {
            HttpResponseMessage httpResponse;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var courses = await
                        (from s in db.Students
                         from c in s.Courses
                         where s.Id == id
                         select new CourseDTO
                         {
                             Id = c.Id,
                             Name = c.Name
                         }).ToListAsync();

                    httpResponse = courses != null ?
                        Request.CreateResponse(HttpStatusCode.OK, courses) :
                        Request.CreateErrorResponse(HttpStatusCode.NotFound, $"The student with ID {id} doesn't have courses");
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
        public async Task<HttpResponseMessage> GetStudentsFiltered([FromUri] string search_term, [FromUri] int? per_page)
        {
            int pageSize = per_page ?? 10;

            HttpResponseMessage httpResponse;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var students = await
                        (from s in db.Students
                         where s.FirstName.Contains(search_term) || s.LastName.Contains(search_term)
                         select new StudentDTO
                         {
                             Id = s.Id,
                             FirstName = s.FirstName,
                             LastName = s.LastName
                         }).Take(pageSize).ToListAsync();

                    var pagedResponse = new PagingModel<StudentDTO>
                    {
                        Data = students,
                        Count = students.Count
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
        public async Task<HttpResponseMessage> AddStudent([FromBody] StudentDTO studentDTO)
        {
            HttpResponseMessage httpResponse;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var student = new Student
                    {
                        FirstName = studentDTO.FirstName,
                        LastName = studentDTO.LastName
                    };

                    db.Students.Add(student);
                    await db.SaveChangesAsync();

                    httpResponse = Request.CreateResponse(HttpStatusCode.Created, student);
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
        public async Task<HttpResponseMessage> UpdateStudent(int id, StudentDTO studentDTO)
        {
            HttpResponseMessage httpResponse;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var student = await db.Students.SingleAsync(i => i.Id == id);

                    if (student != null)
                    {
                        student.FirstName = studentDTO.FirstName;
                        student.LastName = studentDTO.LastName;

                        await db.SaveChangesAsync();

                        httpResponse = Request.CreateResponse(HttpStatusCode.OK, student);
                    }
                    else
                    {
                        httpResponse = Request.CreateErrorResponse(HttpStatusCode.NotFound, $"The student with ID {id} has not been found");
                    }
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
        public async Task<HttpResponseMessage> DeleteStudent(int id)
        {
            HttpResponseMessage httpResponse;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var student = new Student() { Id = id };

                    db.Students.Attach(student);
                    db.Entry(student).State = EntityState.Deleted;
                    await db.SaveChangesAsync();

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
