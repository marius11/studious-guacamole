CREATE PROCEDURE [dbo].[sp_GetStudentsFiltered]
	@search_query NVARCHAR(64),
	@per_page INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT TOP (@per_page) Id, FirstName, LastName
	FROM Students
	WHERE FirstName LIKE '%' + @search_query + '%' OR LastName LIKE '$' + @search_query + '$'
END