CREATE PROCEDURE [dbo].[GetCoursesByStudentId]
	@Id INT,
	@Enrolled BIT = NULL
AS
BEGIN
	SET NOCOUNT ON;

	IF @Enrolled = 'TRUE' OR @Enrolled IS NULL
	BEGIN
		SELECT course.Id, course.Name
		FROM Courses course
		INNER JOIN StudentCourses studentcourse ON studentcourse.Course_Id = course.Id
		INNER JOIN Students student ON student.Id = studentcourse.Student_Id
		WHERE student.Id = @Id
	END
	ELSE
	BEGIN
		SELECT Id, Name
		FROM Courses
		WHERE Id NOT IN
		(
			SELECT course.Id
			FROM Courses course
			LEFT JOIN StudentCourses studentcourse ON studentcourse.Course_Id = course.Id
			LEFT JOIN Students student ON student.Id = studentcourse.Student_Id 
			WHERE student.Id = @Id
		)
	END
END