using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

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

        public Test GetTest(int testnum)
        {
            return _dataService.Tests.FirstOrDefault(x => x.Testnum == testnum);
        }
    }
}