import os
import tempfile
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class TempFileHelper:
    """
    Utility class for managing temporary files.
    Provides static methods to save byte content to a temporary file
    and to remove a temporary file.
    """

    @staticmethod
    def save_temp(file_content_bytes: bytes, original_file_name: str) -> str:
        """
        Saves byte content to a temporary file and returns its path.

        Args:
            file_content_bytes: The byte content to save.
            original_file_name: The original name of the file, used for extension.

        Returns:
            The absolute path to the saved temporary file.
        """
        try:
            # Extract file extension from original_file_name
            suffix = Path(original_file_name).suffix
            
            # Create a temporary file with the original extension
            # delete=False prevents the file from being deleted when closed
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
                temp_file.write(file_content_bytes)
                temp_file_path = temp_file.name
            
            logger.info(f"Temporary file saved to: {temp_file_path}")
            return temp_file_path
        except IOError as e:
            logger.error(f"Failed to save temporary file {original_file_name}: {e}")
            raise
        except Exception as e:
            logger.error(f"An unexpected error occurred while saving temporary file {original_file_name}: {e}")
            raise

    @staticmethod
    def remove_temp(file_path: str) -> None:
        """
        Removes a temporary file from the filesystem.

        Args:
            file_path: The absolute path to the temporary file to remove.
        """
        try:
            os.remove(file_path)
            logger.info(f"Temporary file removed: {file_path}")
        except FileNotFoundError:
            logger.warning(f"Attempted to remove non-existent temporary file: {file_path}")
        except OSError as e:
            logger.error(f"Failed to remove temporary file {file_path}: {e}")
            raise
        except Exception as e:
            logger.error(f"An unexpected error occurred while removing temporary file {file_path}: {e}")
            raise
