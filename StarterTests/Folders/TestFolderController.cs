using Microsoft.VisualStudio.TestTools.UnitTesting;
using Starter.Controllers;
using Starter.Data;
using Starter.Models;
using Moq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace StarterTests
{
    [TestClass]
    public class TestFolderController
    {
        private Folder child = new Folder
        {
            Id = 1,
            Name = "Child1",
            parentId = 0
        };

        private Folder childOfChild = new Folder
        {
            Id = 2,
            Name = "ChildOfChild1",
            parentId = 1
        };

        [TestMethod]
        public void getSingleChild()
        {

            var data = new List<Folder>
            {
                child,
                childOfChild
            }.AsQueryable();
            /*
            var mockFolderDbSet = new Mock<DbSet<Folder>>();
            mockFolderDbSet.As<IQueryable<Folder>>().Setup(m => m.Provider).Returns(data.Provider);
            mockFolderDbSet.As<IQueryable<Folder>>().Setup(m => m.Expression).Returns(data.Expression);
            mockFolderDbSet.As<IQueryable<Folder>>().Setup(m => m.ElementType).Returns(data.ElementType);
            //mockFolderDbSet.As<IQueryable<Folder>>().Setup(m => m.GetEnumerator()).Returns(0 => data.GetEnumerator());

            var mockDB = new Mock<ApplicationDbContext>();
            mockDB.Setup(db => db.Folders).Returns(mockFolderDbSet.Object);

            FolderController folderController = new FolderController(mockDB.Object);
            var testy = folderController.Folders();
            var test = 1;
            */
        }

        
        

            
        
    }
}
