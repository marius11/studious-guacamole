CREATE PROCEDURE [dbo].[InsertStudent]
	@FirstName NVARCHAR(64),
	@LastName NVARCHAR(64)
AS
BEGIN
	SET NOCOUNT ON;

	INSERT INTO Students (FirstName, LastName)
	VALUES (@FirstName, @LastName)

	SELECT CAST(SCOPE_IDENTITY() AS INT) AS Id
END