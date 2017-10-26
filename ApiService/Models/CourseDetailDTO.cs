using System.Collections.Generic;

namespace ApiService.Models
{
    public class CourseDetailDTO
    {
        public int Id;
        public string Name;

        public ICollection<StudentDTO> Students { get; set; }
    }
}