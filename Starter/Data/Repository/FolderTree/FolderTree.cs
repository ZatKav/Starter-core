using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Starter.Data.Repository
{
    public class FolderTree
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<FolderTree> Children { get; set; }
    }
}
