﻿CREATE PROCEDURE [dbo].[sp_DeleteStudentById]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;

	DELETE FROM Students
	WHERE Id = @Id
END