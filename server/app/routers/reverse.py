import io

from fastapi import APIRouter, UploadFile
from fastapi.responses import StreamingResponse
from pydub import AudioSegment

router = APIRouter()


@router.post('/reverse/')
async def reverse(file: UploadFile):
    file_bytes = await file.read()
    audio = AudioSegment.from_file(io.BytesIO(file_bytes), format='webm')
    reversed_audio = audio.reverse()

    output_io = io.BytesIO()
    reversed_audio.export(output_io, format='webm')
    output_io.seek(0)

    return StreamingResponse(
        output_io,
        media_type='audio/webm',
        headers={'Content-Disposition': 'inline'},
    )
