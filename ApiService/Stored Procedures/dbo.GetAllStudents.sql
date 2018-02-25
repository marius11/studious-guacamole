CREATE PROCEDURE [dbo].[GetAllStudents]
AS
BEGIN
	SET NOCOUNT ON;

	SELECT Id, FirstName, LastName
	FROM Students
END