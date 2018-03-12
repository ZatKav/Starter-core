using Starter.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Starter.Data.Repository
{
    public class FolderTreeRepository : IFolderTreeRepository
    {
        private IFolderRepository folderRepository;

        public FolderTreeRepository(IFolderRepository injectedFolderRepository)
        {
            folderRepository = injectedFolderRepository;
        }

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
            parentNode.Children = folderRepository.GetFoldersWithParentOfID(parentNode.Id)
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
                Children = folderRepository.GetFoldersWithParentOfRoot()
                .Select(t => new FolderTree { Id = t.Id, Name = t.Name }).ToList()
            };
        }
    }
}
