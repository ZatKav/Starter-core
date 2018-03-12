using Microsoft.EntityFrameworkCore;
using Starter.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Starter.Data.Repository
{
    public class FolderRepository : IFolderRepository
    {
        private ApplicationDbContext dbContext;

        public FolderRepository(ApplicationDbContext injectedDbContext)
        {
            dbContext = injectedDbContext;
        }

        public DbSet<Folder> Folders { get; set; }

        public IQueryable<Folder> GetFoldersWithParentOfID(int parentID)
        {
            return dbContext.Folders.Where(t => t.parentId == parentID);
        }

        public IQueryable<Folder> GetFoldersWithParentOfRoot()
        {
            return GetFoldersWithParentOfID(0);
        }
    }
}