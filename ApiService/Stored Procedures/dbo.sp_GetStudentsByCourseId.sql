CREATE PROCEDURE [dbo].[sp_GetStudentsByCourseId]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT s.Id, s.FirstName, s.LastName
	FROM Students s
	INNER JOIN StudentCourses sc ON sc.Student_Id = s.Id
	INNER JOIN Courses c ON c.Id = sc.Course_Id
	WHERE c.Id = @Id
END