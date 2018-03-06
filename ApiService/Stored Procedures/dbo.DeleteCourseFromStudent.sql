CREATE PROCEDURE [dbo].[DeleteCourseFromStudent]
	@CourseId INT,
	@StudentId INT
AS
BEGIN
	SET NOCOUNT ON;

	DELETE FROM StudentCourses
	WHERE Course_Id = @CourseId AND Student_Id = @StudentId
END