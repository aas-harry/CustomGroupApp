using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc.Html;
using CustomGroupApp.Models;
using Kendo.Mvc.Extensions;

namespace CustomGroupApp
{
    public class DataService
    {
        private AllwellDataAccessDataContext _dataService;

        public DataService()
        {
            _dataService = new AllwellDataAccessDataContext();
        }

        public IEnumerable<Result> GetResults(int tesnum)
        {
            return _dataService.Results.Where(x => x.Testnum == tesnum).ToList();
        }

        public IEnumerable<StudentLanguagePref> GetStudentLanguagePrefs(int tesnum)
        {
            return _dataService.StudentLanguagePrefs.Where(x => x.Testnum == tesnum).ToList();
        }

        public void UpdateStudentLanguagePrefs(int testnum, IList<StudentLanguagePref> rows)
        {
            // Delete existing rows
            _dataService.StudentLanguagePrefs.DeleteAllOnSubmit(
                _dataService.StudentLanguagePrefs.Where(x => x.Testnum == testnum).ToList());
            _dataService.SubmitChanges();

            _dataService.StudentLanguagePrefs.InsertAllOnSubmit(rows);
            _dataService.SubmitChanges();
        }

        public IEnumerable<CustomGroupSet> GetCustomGroupSets(int testnum)
        {
            var students = (from gs in _dataService.GroupSets
                join s in _dataService.GroupSetStudents on gs.Id equals s.GroupSetId
                where gs.Testnum == testnum
                select new { GroupSetId = gs.Id, gs.Name, s.StudentId}).ToList();
       
            var classes = from s in students
                group s by new {s.GroupSetId, s.Name}
                into g
                select new CustomGroupSet {Name = g.Key.Name, GroupSetId = g.Key.GroupSetId, Students = g.Select(x=> x.StudentId).ToArray() };
             
            return classes;
        }

        public void UpdateCustomGroupSets(IEnumerable<CustomGroupSet> groupSets, int testnum)
        {
            foreach (var gs in groupSets)
            {
                GroupSet existingGs = null;
                if (gs.GroupSetId > 0)
                {
                    existingGs = _dataService.GroupSets.FirstOrDefault(x => x.Id == gs.GroupSetId);
                }
                if (existingGs == null)
                {
                    existingGs = new GroupSet();
                    _dataService.GroupSets.InsertOnSubmit(existingGs);
                }
                existingGs.Testnum = testnum;
                existingGs.Name = gs.Name;
                existingGs.Streaming = gs.Streaming;

                _dataService.SubmitChanges();

                UpdateGroupSetStudents(existingGs.Id, gs.Students);
            }
        }

        public void UpdateGroupSetStudents(int groupSetId, int[] students)
        {
            _dataService.GroupSetStudents.DeleteAllOnSubmit(_dataService.GroupSetStudents.Where(x=> x.GroupSetId == groupSetId));
            _dataService.SubmitChanges();

            foreach (var s in students)
            {
                _dataService.GroupSetStudents.InsertOnSubmit(new GroupSetStudent {GroupSetId = groupSetId, StudentId = s});
            }
            _dataService.SubmitChanges();
        }

        public IEnumerable<int> GetCustomGroupSetStudent(int groupSetId)
        {
            return _dataService.GroupSetStudents.Where(x => x.GroupSetId == groupSetId).Select(x=> x.StudentId).ToList();
        }

        public Test GetTest(int testnum)
        {
            return _dataService.Tests.FirstOrDefault(x => x.Testnum == testnum);
        }

        public School GetSchool(int testnum)
        {
            return
            (from t in _dataService.Tests
                join sc in _dataService.SchoolCodes on t.Scode equals sc.Scode
                join s in _dataService.Schools on sc.SchoolId equals s.Id
                select s).FirstOrDefault();
        }
    }
}