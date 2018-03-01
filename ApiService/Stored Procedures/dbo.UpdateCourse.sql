CREATE PROCEDURE [dbo].[UpdateCourse]
	@Id INT,
	@Name NVARCHAR(128)
AS
BEGIN
	SET NOCOUNT ON;

	UPDATE Courses
	SET Name = @Name
	WHERE Id = @Id
END