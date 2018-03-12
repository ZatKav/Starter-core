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
    public class FolderController : Controller
    {
        private IFolderRepository repository;

        public FolderController(IFolderRepository injectedRepository)
        {
            repository = injectedRepository;
        }

        [HttpGet("[action]")]
        public FolderTree FolderTree()
        {
            FolderTree folderTree = getRootAndChildren();

            for (int i = 0; i < folderTree.Children.Count(); i++)
            {
                var nodeToPopulate = folderTree.Children[i];
                nodeToPopulate = PopulateFolderTreeNode(nodeToPopulate);
            }

            return folderTree;
        }

        private FolderTree PopulateFolderTreeNode(FolderTree parentNode)
        {
            parentNode.Children = repository.GetFoldersWithParentOfID(parentNode.Id)
                .Select(t => new FolderTree { Id = t.Id, Name = t.Name }).ToList();

            foreach (var childNode in parentNode.Children)
            {
                PopulateFolderTreeNode(childNode);
            }
            return parentNode;
        }

        private FolderTree getRootAndChildren()
        {
            return new FolderTree
            {
                Name = "Root",
                Children = repository.GetFoldersWithParentOfRoot()
                .Select(t => new FolderTree { Id = t.Id, Name = t.Name }).ToList()
            };
        }
    }
}
