CREATE PROCEDURE [dbo].[DeleteStudentById]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;

	DELETE FROM Students
	WHERE Id = @Id

	DELETE FROM StudentCourses
	WHERE Student_Id = @id
END