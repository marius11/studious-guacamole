CREATE PROCEDURE [dbo].[sp_GetStudentsPaged]
	@page_number INT,
	@page_size INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT Id, FirstName, LastName
	FROM Students
	ORDER BY Id
	OFFSET @page_number * @page_size ROWS
	FETCH NEXT @page_size ROWS ONLY
END