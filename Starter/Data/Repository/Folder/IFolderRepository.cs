using Microsoft.EntityFrameworkCore;
using Starter.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Starter.Data.Repository
{
    public interface IFolderRepository
    {
        DbSet<Folder> Folders { get; set; }

        IQueryable<Folder> GetFoldersWithParentOfID(int parentID);

        IQueryable<Folder> GetFoldersWithParentOfRoot();
    }
}
