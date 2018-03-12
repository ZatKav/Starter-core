using System;
using System.Collections.Generic;


namespace Starter.Models
{
    public class Folder
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int parentId { get; set; }
        public int order { get; set; }
    }
}
