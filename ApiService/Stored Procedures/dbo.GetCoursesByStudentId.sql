CREATE PROCEDURE [dbo].[GetCoursesByStudentId]
	@Id int
AS
BEGIN
	SET NOCOUNT ON;

	SELECT course.Id, course.Name
	FROM Students student
	INNER JOIN StudentCourses studentcourse ON studentcourse.Student_Id = student.Id
	INNER JOIN Courses course ON course.Id = studentcourse.Course_Id
	WHERE student.Id = @Id
END