import io

from pydub import AudioSegment


def reverse_audio(
    file_bytes: bytes, input_format: str = 'webm', output_format: str = 'webm'
) -> bytes:
    """
    Reverse the audio from the given bytes and return the reversed audio as bytes.
    """
    audio = AudioSegment.from_file(io.BytesIO(file_bytes), format=input_format)
    reversed_audio = audio.reverse()
    output_io = io.BytesIO()
    reversed_audio.export(output_io, format=output_format)
    output_io.seek(0)
    return output_io.read()
