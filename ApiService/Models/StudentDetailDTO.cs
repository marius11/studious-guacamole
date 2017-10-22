using System.Collections.Generic;

namespace ApiService.Models
{
    public class StudentDetailDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<CourseDTO> Courses { get; set; }
    }
}