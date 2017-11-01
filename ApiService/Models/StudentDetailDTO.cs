using System.Collections.Generic;

namespace ApiService.Models
{
    public class StudentDetailDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public ICollection<CourseDTO> Courses { get; set; }
    }
}