using DataAccess;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Service.Controllers;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace ApiService.Tests.Controllers
{
    [TestClass]
    public class StudentsControllerTest
    {
        [TestMethod]
        public async Task<HttpResponseMessage> GetAllStudents()
        {
            // Arrange
            StudentsController studentsController = new StudentsController
            {
                Request = new HttpRequestMessage(),
                Configuration = new System.Web.Http.HttpConfiguration()
            };

            // Act
            var response = await studentsController.GetAllStudents();

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.IsTrue(response.TryGetContentValue(out List<Student> students));
            Assert.AreEqual(students.Count, 20);

            return null;
        }
    }
}
