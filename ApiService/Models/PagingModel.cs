using System.Collections.Generic;

namespace ApiService.Models
{
    public class PagingModel<T>
    {
        public ICollection<T> Data { get; set; }
        public int Count { get; set; }
    }
}