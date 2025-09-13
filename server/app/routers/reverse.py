import io

from fastapi import APIRouter, UploadFile
from fastapi.responses import StreamingResponse

from app.utils import reverse_audio

router = APIRouter()


@router.post('/reverse/')
async def reverse(file: UploadFile):
    file_bytes = await file.read()
    reversed_bytes = reverse_audio(
        file_bytes, input_format='webm', output_format='webm'
    )
    output_io = io.BytesIO(reversed_bytes)
    return StreamingResponse(
        output_io,
        media_type='audio/webm',
        headers={'Content-Disposition': 'inline'},
    )
