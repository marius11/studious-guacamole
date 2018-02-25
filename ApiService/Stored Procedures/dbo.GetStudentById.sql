CREATE PROCEDURE [dbo].[GetStudentById]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT Id, FirstName, LastName
	FROM Students
	WHERE Id = @Id
END