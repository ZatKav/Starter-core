using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Starter.Data;
using Starter.Data.Repository;
using Starter.Models;

namespace Starter.Controllers
{
    [Route("api/[controller]")]
    public class FolderTreeController : Controller
    {
        private IFolderTreeRepository repository;

        public FolderTreeController(IFolderTreeRepository injectedRepository)
        {
            repository = injectedRepository;
        }

        [HttpGet("[action]")]
        public FolderTree FolderTree()
        {
            return repository.FolderTree();
        }
    }
}
