CREATE PROCEDURE [dbo].[DeleteCourseById]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;

	DELETE FROM Courses
	WHERE Id = @Id

	DELETE FROM StudentCourses
	WHERE Course_Id = @Id
END