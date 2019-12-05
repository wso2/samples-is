package exceptions.tokenerrors;

import exceptions.BadRequestParentException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class Expired_Token extends BadRequestParentException {

    public Expired_Token(String var1) {

        super(var1);

    }

}
