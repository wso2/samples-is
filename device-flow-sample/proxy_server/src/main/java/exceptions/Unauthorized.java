package exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// 401 Error for invalid client
@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class Unauthorized extends BadRequestParentException {

    public Unauthorized(String var1) {
        super(var1);

    }
}