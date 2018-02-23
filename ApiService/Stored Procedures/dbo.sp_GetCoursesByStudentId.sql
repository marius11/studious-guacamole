CREATE PROCEDURE [dbo].[sp_GetCoursesByStudentId]
	@Id int
AS
BEGIN
	SET NOCOUNT ON;

	SELECT c.Id, c.Name
	FROM Students s
	INNER JOIN StudentCourses sc ON sc.Student_Id = s.Id
	INNER JOIN Courses c ON c.Id = sc.Course_Id
	WHERE s.Id = @Id
END