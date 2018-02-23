CREATE PROCEDURE [dbo].[sp_GetCoursesFiltered]
	@search_query NVARCHAR(64),
	@per_page INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT TOP (@per_page) Id, Name
	FROM Courses
	WHERE Name LIKE '%' + @search_query + '%'
END