CREATE PROCEDURE [dbo].[sp_InsertStudent]
	@FirstName NVARCHAR(64),
	@LastName NVARCHAR(64)
AS
BEGIN
	SET NOCOUNT ON;

	INSERT INTO Students (FirstName, LastName)
	VALUES (@FirstName, @LastName)

	SELECT SCOPE_IDENTITY() AS Id
END