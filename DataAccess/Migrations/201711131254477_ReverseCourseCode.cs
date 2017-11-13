namespace DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ReverseCourseCode : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Courses", "Code");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Courses", "Code", c => c.String());
        }
    }
}
