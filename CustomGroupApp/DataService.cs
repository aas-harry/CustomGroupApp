using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using CustomGroupApp.Models;

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

        public IEnumerable<CustomGroupSet> GetCustomGroupSet(int testnum)
        {
            from gs in _dataService.GroupSets
            join s in _dataService.GroupSetStudents on gs.Id equals s.GroupSetId
            where gs.Testnum == testnum
            group gs by gs.Id into groupSet
            select new {groupSet.Key, students = groupSet.Select(x=> new {})}

        }

        public IEnumerable<GroupSetStudent> GetCustomGroupSetStudent(int groupSetId)
        {
            return _dataService.GroupSetStudents.Where(x => x.GroupSetId == groupSetId).ToList();
        }

        public Test GetTest(int testnum)
        {
            return _dataService.Tests.FirstOrDefault(x => x.Testnum == testnum);
        }
    }
}