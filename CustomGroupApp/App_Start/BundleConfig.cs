using System.Web;
using System.Web.Optimization;

namespace CustomGroupApp
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                    "~/Scripts/jquery-{version}.js",
                    "~/Scripts/jquery-ui-{version}.js",
                    "~/Scripts/jquery.jqGrid.js"));

            bundles.Add(new ScriptBundle("~/bundles/kendo").Include(
                    "~/Scripts/kendo/2016.1.226/jquery.min.js",
                    "~/Scripts/kendo/2016.1.226/jszip.min.js",
                    "~/Scripts/jquery.jqGrid.js",
                    "~/Scripts/kendo/2016.1.226/kendo.all.min.js",
                    "~/Scripts/kendo/2016.1.226/kendo.aspnetmvc.min.js"));


            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/utils").Include(
                      "~/Scripts/linq.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                      "~/Scripts/app/*.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/font-awesome.min.css"
                      //"~/Content/kendo/2016.1.226/kendo.common.min.css",
                      //"~/Content/kendo/2016.1.226/kendo.common-fiori.min.css",
                      //"~/Content/kendo/2016.1.226/kendo.mobile.all.min.css",
                      //"~/Content/kendo/2016.1.226/kendo/2016.1.226/kendo.dataviz.min.css",
                      //"~/Content/kendo/2016.1.226/kendo.dataviz.fiori.min.css"
                      ));
        }
    }
}
