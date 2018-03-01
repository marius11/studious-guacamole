CREATE PROCEDURE [dbo].[UpdateStudent]
	@Id INT,
	@FirstName NVARCHAR(64) = NULL,
	@LastName NVARCHAR(64) = NULL
AS

IF COALESCE(@FirstName, @LastName) IS NOT NULL
BEGIN
	SET NOCOUNT ON;

	UPDATE Students
	SET 
		FirstName = COALESCE(@FirstName, FirstName),
		LastName = COALESCE(@LastName, LastName)
	WHERE Id = @Id
END