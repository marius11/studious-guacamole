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
                    var students = await db.Database.SqlQuery<StudentDTO>("sp_GetAllStudents").ToListAsync();
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
            HttpResponseMessage httpResponse;

            int pageNumber = page - 1 ?? 0;
            int pageSize = per_page ?? 10;

            var pagedStudentsParams = new[]
            {
                new SqlParameter("@page_number", SqlDbType.Int) { Value = pageNumber },
                new SqlParameter("@page_size", SqlDbType.Int) { Value = pageSize }
            };

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var students = await db.Database
                        .SqlQuery<StudentDTO>("sp_GetStudentsPaged @page_number, @page_size", pagedStudentsParams)
                        .ToListAsync();

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
            var studentIdParam = new SqlParameter("@Id", SqlDbType.Int) { Value = id };

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var student = await db.Database
                        .SqlQuery<StudentDTO>("sp_GetStudentById @Id", studentIdParam)
                        .SingleAsync();

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
            var studentIdParam = new SqlParameter("@Id", SqlDbType.Int) { Value = id };

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var courses = await db.Database
                        .SqlQuery<CourseDTO>("sp_GetCoursesByStudentId @Id", studentIdParam)
                        .ToListAsync();

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
            HttpResponseMessage httpResponse;
            int pageSize = per_page ?? 10;

            var filteredStudentsParams = new[]
            {
                new SqlParameter("@search_query", SqlDbType.NVarChar, search_term.Length) { Value = search_term },
                new SqlParameter("@per_page", SqlDbType.Int) { Value = pageSize }
            };

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var students = await db.Database
                        .SqlQuery<StudentDTO>("sp_GetStudentsFiltered @search_query, @per_page", filteredStudentsParams)
                        .ToListAsync();

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

            var insertStudentParams = new[]
            {
                new SqlParameter("@FirstName", SqlDbType.NVarChar, studentDTO.FirstName.Length)
                {
                    Value = studentDTO.FirstName
                },
                new SqlParameter("@LastName", SqlDbType.NVarChar, studentDTO.LastName.Length)
                {
                    Value = studentDTO.LastName
                }
            };

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var student = await db.Database
                        .SqlQuery<StudentDTO>("sp_InsertStudent @FirstName, @LastName", insertStudentParams)
                        .SingleAsync();

                    httpResponse = Request.CreateResponse(HttpStatusCode.Created, student);
                }
            }
            catch (Exception e)
            {
                httpResponse = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            return httpResponse;
        }

        [HttpPost]
        [Route("{id:int}/courses")]
        public async Task<HttpResponseMessage> AssignCourseToStudent(int id, [FromBody] CourseDTO courseDTO)
        {
            HttpResponseMessage httpResponse;

            var assignCourseParams = new[]
            {
                new SqlParameter("@CourseId", SqlDbType.Int) { Value = courseDTO.Id },
                new SqlParameter("@StudentId", SqlDbType.Int) { Value = id }
            };

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    await db.Database.ExecuteSqlCommandAsync("sp_AssignCourseToStudent @CourseId, @StudentId", assignCourseParams);
                    httpResponse = Request.CreateResponse(HttpStatusCode.OK);
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
                    var student = new Student()
                    {
                        Id = studentDTO.Id,
                        FirstName = studentDTO.FirstName,
                        LastName = studentDTO.LastName
                    };

                    db.Students.Attach(student);
                    db.Entry(student).State = EntityState.Modified;
                    await db.SaveChangesAsync();

                    httpResponse = Request.CreateResponse(HttpStatusCode.OK, student);

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
            var deleteStudentParam = new SqlParameter("@Id", SqlDbType.Int) { Value = id };

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    await db.Database.ExecuteSqlCommandAsync("sp_DeleteStudentById @Id", deleteStudentParam);
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
