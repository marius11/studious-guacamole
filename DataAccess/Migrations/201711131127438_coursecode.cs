namespace DataAccess.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class coursecode : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Courses", "Code", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Courses", "Code");
        }
    }
}
