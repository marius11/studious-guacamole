CREATE PROCEDURE [dbo].[AssignCourseToStudent]
	@CourseId INT,
	@StudentId INT
AS
BEGIN
	SET NOCOUNT ON;
	
	INSERT INTO StudentCourses (Course_Id, Student_Id)
	VALUES (@CourseId, @StudentId)
END