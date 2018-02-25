CREATE PROCEDURE [dbo].[sp_GetAllStudents]
AS
BEGIN
	SET NOCOUNT ON;

	SELECT Id, FirstName, LastName
	FROM Students
END