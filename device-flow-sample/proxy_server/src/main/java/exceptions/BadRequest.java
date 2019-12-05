package exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

//400 error for bad requests
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequest extends BadRequestParentException {

    public BadRequest(String var1) {

        super(var1);

    }
}
