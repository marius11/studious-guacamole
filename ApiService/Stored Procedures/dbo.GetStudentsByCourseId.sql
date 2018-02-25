CREATE PROCEDURE [dbo].[GetStudentsByCourseId]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT student.Id, student.FirstName, student.LastName
	FROM Students student
	INNER JOIN StudentCourses studentcourse ON studentcourse.Student_Id = student.Id
	INNER JOIN Courses course ON course.Id = studentcourse.Course_Id
	WHERE course.Id = @Id
END