BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Customer] ADD CONSTRAINT [Customer_updatedAt_df] DEFAULT CURRENT_TIMESTAMP FOR [updatedAt];

-- AlterTable
ALTER TABLE [dbo].[Order] ADD CONSTRAINT [Order_updatedAt_df] DEFAULT CURRENT_TIMESTAMP FOR [updatedAt];

-- AlterTable
ALTER TABLE [dbo].[Product] ADD CONSTRAINT [Product_updatedAt_df] DEFAULT CURRENT_TIMESTAMP FOR [updatedAt];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH