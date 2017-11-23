﻿using ApiService.Models;
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
            HttpResponseMessage responseMessage;

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

                    responseMessage = Request.CreateResponse(HttpStatusCode.OK, students);
                }
            }
            catch (Exception e)
            {
                responseMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            return responseMessage;
        }

        [HttpGet]
        [Route("~/api/v2/students")]
        public HttpResponseMessage GetAllStudents([FromUri] int? page, [FromUri] int? items)
        {
            return Request.CreateErrorResponse(HttpStatusCode.NotImplemented, "This method hasn't been implemented yet.");
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<HttpResponseMessage> GetStudentById(int id)
        {
            HttpResponseMessage responseMessage;

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

                    responseMessage = student != null ?
                        Request.CreateResponse(HttpStatusCode.OK, student) :
                        Request.CreateErrorResponse(HttpStatusCode.NotFound, $"The student with ID {id} has not been found.");
                }
            }
            catch (Exception e)
            {
                responseMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            return responseMessage;
        }

        [HttpGet]
        [Route("{id:int}/courses")]
        public async Task<HttpResponseMessage> GetCoursesByStudent(int id)
        {
            HttpResponseMessage responseMessage;

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

                    responseMessage = courses != null ?
                        Request.CreateResponse(HttpStatusCode.OK, courses) :
                        Request.CreateErrorResponse(HttpStatusCode.NotFound, $"The student with ID {id} doesn't have courses.");
                }
            }
            catch (Exception e)
            {
                responseMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            return responseMessage;
        }

        [HttpPost]
        [Route("")]
        public async Task<HttpResponseMessage> AddStudent([FromBody] StudentDTO studentDTO)
        {
            HttpResponseMessage responseMessage;

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

                    responseMessage = Request.CreateResponse(HttpStatusCode.Created, student);
                }
            }
            catch (Exception e)
            {
                responseMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            return responseMessage;
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<HttpResponseMessage> UpdateStudent(int id, StudentDTO studentDTO)
        {
            HttpResponseMessage responseMessage;

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

                        responseMessage = Request.CreateResponse(HttpStatusCode.OK, student);
                    }
                    else
                    {
                        responseMessage = Request.CreateErrorResponse(HttpStatusCode.NotFound, $"The student with ID {id} has not been found.");
                    }
                }
            }
            catch (Exception e)
            {
                responseMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            return responseMessage;
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<HttpResponseMessage> DeleteStudent(int id)
        {
            HttpResponseMessage responseMessage;

            try
            {
                using (AppDbContext db = new AppDbContext())
                {
                    var student = await db.Students.SingleAsync(s => s.Id == id);

                    if (student != null)
                    {
                        db.Students.Remove(student);
                        await db.SaveChangesAsync();

                        responseMessage = Request.CreateResponse(HttpStatusCode.OK);
                    }
                    else
                    {
                        responseMessage = Request.CreateErrorResponse(HttpStatusCode.NotFound, $"The student with ID {id} has not been found.");
                    }
                }
            }
            catch (Exception e)
            {
                responseMessage = Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
            }
            return responseMessage;
        }
    }
}
